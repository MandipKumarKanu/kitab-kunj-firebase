import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase.config";

const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

export const isNewVisitorToday = () => {
  const lastVisit = localStorage.getItem("lastVisitDate");
  const currentDate = getCurrentDate();

  if (lastVisit === currentDate) {
    return false;
  } else {
    localStorage.setItem("lastVisitDate", currentDate);
    return true;
  }
};

export const updateFirestoreTraffic = async () => {
  try {
    const currentDate = getCurrentDate();
    const analyticsRef = doc(db, "analytics", currentDate);
    const analyticsDoc = await getDoc(analyticsRef);

    const newTraffic =
      (analyticsDoc.exists() ? analyticsDoc.data().traffic : 0) + 1;

    await setDoc(analyticsRef, { traffic: newTraffic }, { merge: true });

    console.log("Traffic updated in Firestore:", newTraffic);
  } catch (error) {
    console.error("Error updating Firestore traffic:", error);
  }
};
