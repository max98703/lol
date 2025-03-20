import firestore from '@react-native-firebase/firestore';

// Function to check if user exists and update or create accordingly
const writeData = async (collectionName, data) => {
  try {
    const userRef = firestore().collection(collectionName).doc(data.uid); // Use UID as the document ID
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      // ✅ User exists → Update their data
      await userRef.update(data);
      console.log("User data updated in Firestore");
    } else {
      // 🚀 User does NOT e into what you were into premiumxist → Create a new document
      await userRef.set(data);
      console.log("User data added to Firestore");
    }
  } catch (error) {
    console.error("Firestore error:", error.message);
  }
};

export default writeData;