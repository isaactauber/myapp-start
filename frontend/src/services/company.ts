import {
    collection,
    query,
    orderBy,
    onSnapshot,
    where,
  } from "firebase/firestore";
  import { FIREBASE_AUTH, FIREBASE_DB } from "../../firebaseConfig";
  import { Company } from "../../types";
  
  export const getCompaniesByUserId = (
    uid = FIREBASE_AUTH.currentUser?.uid,
  ): Promise<Company[]> => {
    return new Promise((resolve, reject) => {
      if (!uid) {
        reject(new Error("User ID is not set"));
        return;
      }
  
      const q = query(
        collection(FIREBASE_DB, "company"),
        where("creator", "==", uid),
        orderBy("creation", "desc"),
      );
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let companies = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data } as Company;
        });
        resolve(companies);
      });
  
      return () => unsubscribe();
    });
  };
  