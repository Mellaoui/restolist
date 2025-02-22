import { defineNuxtPlugin, useRuntimeConfig } from "#app";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  type User,
  browserLocalPersistence,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default defineNuxtPlugin(async (nuxtApp) => {
  if (process.server) {
    console.warn("⚠️ Skipping Firebase initialization on SSR.");
    return;
  }

  const config = useRuntimeConfig().public;

  if (!config.firebaseApiKey) {
    console.error("❌ Firebase API Key is missing! Check your `.env` file.");
    return;
  }

  const firebaseConfig = {
    apiKey: config.firebaseApiKey,
    authDomain: config.firebaseAuthDomain,
    projectId: config.firebaseProjectId,
    storageBucket: config.firebaseStorageBucket,
    messagingSenderId: config.firebaseMessagingSenderId,
    appId: config.firebaseAppId,
    measurementId: config.firebaseMeasurementId,
  };

  console.log("✅ Firebase Config Loaded");

  // ✅ Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);
  console.log("✅ Firebase Initialized");

  // ✅ Initialize Authentication
  const auth = getAuth(firebaseApp);
  console.log("✅ Firebase Auth Initialized");

  // ✅ Initialize Firestore
  const db = getFirestore(firebaseApp);
  console.log("✅ Firestore Initialized");

  const storage = getStorage(firebaseApp);

  await setPersistence(auth, browserLocalPersistence)
    .then(() => console.log("✅ Firebase Auth Persistence Set to LOCAL"))
    .catch((error) => console.error("❌ Error setting persistence:", error));

  // 🔥 Track Authentication State
  let currentUser: User | null = null;

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser = user;
      console.log("🔥 Authenticated User:", user.email);
    } else {
      currentUser = null;
      console.log("🚪 User Signed Out.");
    }
  });

  // ✅ Get Authentication Token with Proper Handling
  const getAuthToken = async () => {
    return new Promise<string | null>((resolve, reject) => {
      // Ensure the user is authenticated first
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const token = await user.getIdToken();
            console.log("✅ Retrieved Auth Token:", token);
            resolve(token);
          } catch (error) {
            console.error("❌ Error retrieving authentication token:", error);
            reject(error);
          }
        } else {
          console.warn("⚠️ No user is logged in. Firestore requests may fail.");
          resolve(null);
        }
        unsubscribe();
      });
    });
  };

  nuxtApp.provide("uploadFile", async (file: File, path: string) => {
    try {
      const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error("❌ File upload failed:", error);
      throw error;
    }
  });

  // ✅ Provide Authentication State
  nuxtApp.provide("auth", auth);
  nuxtApp.provide("db", db);
  nuxtApp.provide("storage", storage);
  nuxtApp.provide("currentUser", () => currentUser);

  // 🔑 Register a User
  nuxtApp.provide(
    "registerWithEmail",
    async (email: string, password: string) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("✅ User Registered:", userCredential.user);
        return userCredential;
      } catch (error) {
        console.error("❌ Registration failed:", (error as Error).message);
        throw error;
      }
    }
  );

  // 🔑 Log in a User
  nuxtApp.provide("loginWithEmail", async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("✅ User Logged In:", userCredential.user);
      return userCredential;
    } catch (error) {
      console.error("❌ Login failed:", (error as Error).message);
      throw error;
    }
  });

  // 🔑 Log out a User
  nuxtApp.provide("logout", async () => {
    try {
      await signOut(auth);

      // Clear session cookie (if any)
      const sessionCookie = useCookie("firebase-session");
      sessionCookie.value = null;

      console.log("🚪 User Logged Out!");
      currentUser = null;

      // Redirect to login page
      navigateTo("/login");
    } catch (error) {
      console.error("❌ Logout failed:", (error as Error).message);
    }
  });

  const getStats = async () => {
    try {
      const db = getFirestore(); // ✅ Correct Firestore instance

      // ✅ Get total number of restaurants
      const totalRestaurantsSnapshot = await getDocs(
        collection(db, "restaurants")
      );
      const totalRestaurants = totalRestaurantsSnapshot.size;

      // ✅ Get new restaurants added in the last 30 days
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);

      const newRestaurantsQuery = query(
        collection(db, "restaurants"),
        where("createdAt", ">=", thirtyDaysAgo.toISOString())
      );
      const newRestaurantsSnapshot = await getDocs(newRestaurantsQuery);
      const newRestaurants = newRestaurantsSnapshot.size;

      // ✅ Get previous 30 days for trend analysis
      const prevThirtyDaysAgo = new Date();
      prevThirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const previousMonthQuery = query(
        collection(db, "restaurants"),
        where("createdAt", ">=", prevThirtyDaysAgo.toISOString()),
        where("createdAt", "<", thirtyDaysAgo.toISOString())
      );
      const previousMonthSnapshot = await getDocs(previousMonthQuery);
      const previousMonthRestaurants = previousMonthSnapshot.size;

      // ✅ Calculate growth percentage
      const growthRate =
        previousMonthRestaurants > 0
          ? (
              ((newRestaurants - previousMonthRestaurants) /
                previousMonthRestaurants) *
              100
            ).toFixed(2)
          : "N/A";

      return {
        totalRestaurants,
        newRestaurants,
        growthRate,
        previousMonthRestaurants,
      };
    } catch (error) {
      console.error("❌ Error fetching stats:", error);
      throw error;
    }
  };

  // 🔑 Add a Restaurant to Firestore
  nuxtApp.provide("addRestaurantToFirestore", async (restaurant: any) => {
    try {
      const token = await getAuthToken();
      if (!token)
        throw new Error("❌ Authentication token is missing. Please log in.");

      const docRef = await addDoc(collection(db, "restaurants"), {
        ...restaurant,
        createdAt: new Date().toISOString(),
      });

      console.log("✅ Restaurant added with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("❌ Error adding restaurant:", error);
      throw error;
    }
  });

  // 🔑 Fetch Restaurants from Firestore
  nuxtApp.provide("getRestaurants", async () => {
    try {
      const token = await getAuthToken();
      if (!token)
        throw new Error("❌ Authentication token is missing. Please log in.");

      const q = query(
        collection(db, "restaurants"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const restaurants = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("✅ Fetched Restaurants:", restaurants.length);
      return restaurants;
    } catch (error) {
      console.error("❌ Error fetching restaurants:", error);
      throw error;
    }
  });

  nuxtApp.provide("getStats", getStats);
});
