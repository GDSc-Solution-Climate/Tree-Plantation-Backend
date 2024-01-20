"use client"
import { signIn, signOut, useSession } from "next-auth/react";


function SignIn() {
  const { data: session } = useSession();
  if( session && session.user){
    return(
        <button onClick={()=>{signOut()}}>sign out</button>
    )
  }

  return (
    <>
      <button onClick={()=>{signIn()}}>sign in</button>
    </>
  );
}

export default SignIn;