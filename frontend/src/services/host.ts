import {
    collection,
    query,
    orderBy,
    onSnapshot,
    where,
    getDoc,
    doc,
  } from "firebase/firestore";
  import { FIREBASE_AUTH, FIREBASE_DB } from "../../firebaseConfig";
  import { Host } from "../../types";
  
  export const getHostsByUserId = (
    uid = FIREBASE_AUTH.currentUser?.uid,
  ): Promise<Host[]> => {
    return new Promise((resolve, reject) => {
      if (!uid) {
        reject(new Error("User ID is not set"));
        return;
      }
  
      const q = query(
        collection(FIREBASE_DB, "host"),
        where("creator", "==", uid),
        orderBy("creation", "desc"),
      );
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let hosts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data } as Host;
        });
        resolve(hosts);
      });
  
      return () => unsubscribe();
    });
  };

  /**
   * fetches the doc corresponding to the id of a user.
   *
   * @param {String} id of the user we want to fetch
   * @returns {Promise<User>} user object if successful.
   */
  export const getHostById = async (id: string): Promise<Host | null> => {
    try {
      const docSnapshot = await getDoc(doc(FIREBASE_DB, "host", id));
      if (docSnapshot.exists()) {
        return docSnapshot.data() as Host;
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(String(error));
    }
};
  