"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { signIn, signUp } from "@/lib/actions/authaction";
import FormField from "./FormField";

const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3),
    });
};

const AuthForm = ({ type }: { type: FormType }) => {
    const router = useRouter();

    const formSchema = authFormSchema(type);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            if (type === "sign-up") {
                const { name, email, password } = data;

                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

                const { user } = userCredential;
                const idToken = await user.getIdToken();

                const response = await signUp({
                    uid: user.uid,
                    name: name!,
                    email: user.email!,
                });

                if (response.success) {
                    toast.success(response.message);
                    router.push("/sign-in");
                } else {
                    toast.error(response.message);
                }
            } else {
                const { email, password } = data;

                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

                const { user } = userCredential;
                const idToken = await user.getIdToken();

                const response = await signIn({
                    uid: user.uid,
                    email: user.email!,
                });

                if (response.success) {
                    toast.success(response.message);
                    router.push("/");
                } else {
                    toast.error(response.message);
                }
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="auth-layout">
            <div className="flex flex-col items-center justify-center">
                <Image 
                    src="/logo.svg" 
                    alt="logo" 
                    height={32} 
                    width={38} 
                    priority
                    loading="eager"
                    className="mb-4"
                />
                <h1 className="text-2xl font-bold mb-4">
                    {type === "sign-up" ? "Create an account" : "Sign in to your account"}
                </h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {type === "sign-up" && (
                        <FormField
                            control={form.control}
                            name="name"
                            label="Name"
                            placeholder="Enter your name"
                        />
                    )}

                    <FormField
                        control={form.control}
                        name="email"
                        label="Email"
                        placeholder="Enter your email"
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                    />

                    <Button type="submit" className="w-full">
                        {type === "sign-up" ? "Sign Up" : "Sign In"}
                    </Button>
                </form>
            </Form>

            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                    {type === "sign-up" ? (
                        <>
                            Already have an account?{" "}
                            <Link href="/sign-in" className="text-primary hover:underline">
                                Sign in
                            </Link>
                        </>
                    ) : (
                        <>
                            Don't have an account?{" "}
                            <Link href="/sign-up" className="text-primary hover:underline">
                                Sign up
                            </Link>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
};

export default AuthForm;



































































































































// "use client";
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
//
// import { Button } from "@/components/ui/button"
// import {Form} from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import Image from "next/image";
// import Link from "next/link";
// import {toast} from "sonner";
// import FormField from "@/components/FormField";
// import {useRouter} from "next/navigation";
// import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
// import {auth} from "@/firebase/client";
// import {signIn, signUp} from "@/lib/actions/authaction";
//
//
// const authFormSchema =  ({type} : {type : FormType}) => {
//     return z.object ({
//         name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
//         email: z.string().email(),
//         password: z.string().min(3),
//     })
// }
// const AuthForm = ( {type} : {type: FormType }) => {
//     const  router = useRouter();
//     const formSchema = a uthFormSchema(type);
//     // 1. Define your form.
//     const form = useForm<z.infer<typeof formSchema>>({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             name: "",
//             email: "",
//             password: "",
//         },
//     })
//
//     // 2. Define a submit handler.
//     async function onSubmit(values: z.infer<typeof formSchema>) {
//         try{
//             if(type === 'sign-up'){
//                 const {name, email, password} = values;
//
//                 const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
//
//                 const result = await signUp({
//                     uid: userCredentials.user.uid,
//                     name: name!,
//                     email,
//                     password,
//                 })
//
//                 if(!result?.success){
//                     toast.error(result?.message);
//                     return;
//                 }
//
//
//                 toast.success('Account created successfully. Please sign in.')
//                 router.push('/sign-in')
//                 console.log('SIGN UP', values);
//
//             }else{
//                 const {email, password} = values;
//
//                 const userCredentials = await signInWithEmailAndPassword(auth, email, password);
//
//                 const  idToken = await userCredentials.user.getIdToken();
//
//                 if(!idToken){
//                     toast.error('Sign in failed')
//                     return;
//                 }
//
//                 await signIn({
//                     email, idToken
//                 })
//
//                 toast.success('Signed in successfully.')
//                 router.push('/')
//             }
//         } catch(error){
//             console.log(error);
//             toast.error(`There was an error: ${error}`)
//         }
//     }
//
//     const isSignIn = type === 'sign-in';
//
//     return (
//         <div className="card-border lg:min-w-[566px]">
//             <div className="flex flex-col gap-6 card py-14 px-10">
//                 <div className="flex flex-row gap-2 justify-center">
//                     <Image
//                         src="/logo.svg"
//                         alt="logo"
//                         height={32}
//                         width={38}
//                         className="w-[38px] h-[32px]"
//                     />
//                     <h2 className="text-primary-100">MockMuse</h2>
//                 </div>
//
//                 <h3>Practice job interviews with AI</h3>
//
//                 <Form {...form}>
//                     <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
//                         {!isSignIn && (
//                             <FormField
//                                 control={form.control}
//                                 name="name"
//                                 label="Name"
//                                 placeholder="Your Name"
//                             />
//                             )}
//                         <FormField
//                             control={form.control}
//                             name="email"
//                             label="Email"
//                             placeholder="Your email address"
//                             type="email"
//                         />
//
//                         <FormField
//                             control={form.control}
//                             name="password"
//                             label="Password"
//                             placeholder="Enter your password"
//                             type="password"
//                         />
//                         <Button className="btn" type="submit">{isSignIn ? 'Sign in' : 'Create an Account'}</Button>
//                     </form>
//                 </Form>
//
//                 <p className="text-center">
//                     {isSignIn ? 'No account yet?' : 'Have an account already?'}
//
//                     <Link href={!isSignIn ? '/sign-in' : '/sign-up'} className= "font-bold text-user-primary ml-1">
//                         {!isSignIn ? 'Sign in' : 'Sign up'}
//                     </Link>
//                 </p>
//             </div>
//         </div>
//     )
// }
// export default AuthForm
