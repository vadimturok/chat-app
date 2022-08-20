import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, firestore} from "../../firebaseconfig";
import Loader from "../components/Loader/Loader";
import Login from "../components/Login/Login";
import {User} from "@firebase/auth";
import {doc, getDoc, setDoc} from "@firebase/firestore";
import {useEffect} from "react";
import Layout from "../components/Layout/Layout";
import {seedInitialData} from "../utils";



function MyApp({ Component, pageProps }: AppProps) {
  const [user, loading] = useAuthState(auth)

  const createUserDocument = async (user: User) => {
    const userDocRef = doc(firestore, 'users', user.uid)
    const userSnap = await getDoc(userDocRef)
    await setDoc(userDocRef, JSON.parse(JSON.stringify(user)))
    if(!userSnap.exists()){
      await seedInitialData(user)
    }
  }

  useEffect(() => {
    if(user){
      createUserDocument(user)
    }
  }, [user])

  if(loading){
    return <Loader/>
  }

  if(!user){
    return <Login/>
  }

  return (
      <Layout>
        <Component {...pageProps}/>
      </Layout>
  )
}

export default MyApp
