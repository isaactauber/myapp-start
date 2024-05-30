import {
    collection,
    query,
    orderBy,
    onSnapshot,
    where,
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
  