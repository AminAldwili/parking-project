import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDEVwENvKXnGmt74Y83Z9d7Jem_YNrSHXI",
  databaseURL: "https://smartparkingsystem-9d3ae-default-rtdb.firebaseio.com",
  projectId: "smartparkingsystem-9d3ae"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue, set };