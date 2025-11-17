import {
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";
import { Camera, Lens, Mount } from "./types";

// Simple in-memory cache
let camerasCache: Camera[] | null = null;
let lensesCache: Lens[] | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let cacheTimestamp = 0;

// Get all cameras with caching
export async function getCameras(): Promise<Camera[]> {
  try {
    // Return cached data if available and fresh
    if (camerasCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
      return camerasCache;
    }

    const camerasRef = collection(db, "cameras");
    const snapshot = await getDocs(camerasRef);
    camerasCache = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Camera[];
    cacheTimestamp = Date.now();
    return camerasCache;
  } catch (error) {
    console.error("Error fetching cameras:", error);
    return camerasCache || [];
  }
}

// Get all lenses with caching
export async function getLenses(): Promise<Lens[]> {
  try {
    // Return cached data if available and fresh
    if (lensesCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
      return lensesCache;
    }

    const lensesRef = collection(db, "lenses");
    const snapshot = await getDocs(lensesRef);
    lensesCache = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Lens[];
    cacheTimestamp = Date.now();
    return lensesCache;
  } catch (error) {
    console.error("Error fetching lenses:", error);
    return lensesCache || [];
  }
}

// Get cameras by mount (uses cache)
export async function getCamerasByMount(mount: Mount): Promise<Camera[]> {
  try {
    const cameras = await getCameras();
    return cameras.filter((camera) => camera.mount === mount);
  } catch (error) {
    console.error("Error fetching cameras by mount:", error);
    return [];
  }
}

// Get lenses by mount (uses cache)
export async function getLensesByMount(mount: Mount): Promise<Lens[]> {
  try {
    const lenses = await getLenses();
    return lenses.filter((lens) => lens.mount === mount);
  } catch (error) {
    console.error("Error fetching lenses by mount:", error);
    return [];
  }
}

// Get camera by ID
export async function getCameraById(id: string): Promise<Camera | null> {
  try {
    const cameras = await getCameras();
    return cameras.find((camera) => camera.id === id) || null;
  } catch (error) {
    console.error("Error fetching camera by ID:", error);
    return null;
  }
}

// Get lens by ID
export async function getLensById(id: string): Promise<Lens | null> {
  try {
    const lenses = await getLenses();
    return lenses.find((lens) => lens.id === id) || null;
  } catch (error) {
    console.error("Error fetching lens by ID:", error);
    return null;
  }
}

