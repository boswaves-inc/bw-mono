import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel } from "~/components/v3/core/form";
import { Link } from "react-router";
import { Mark } from "~/components/v3/logo";
import { InputControl } from "~/components/v3/core/form/control";
import { Button } from "~/components/v3/core/button";

export default () => {
    const form = useForm()

    return (
        <div className="w-full max-w-md rounded-xl bg-white shadow-md ring-1 ring-black/5">
            <Form control={form} method="post" action="./" className="p-7 sm:p-11 space-y-8">
                <div>
                    <div className="flex items-start">
                        <Link to="/" title="Home">
                            <Mark className="h-9 fill-black" />
                        </Link>
                    </div>
                    <h1 className="mt-8 text-base/6 font-medium">Recover your account!</h1>
                    <p className="mt-1 text-sm/5 text-gray-600">
                        Enter your email, and we will send you instructions to reset your password.
                    </p>
                </div>

                <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem >
                            <FormLabel>Email</FormLabel>
                            <InputControl required type="email" {...field} />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">
                    Reset Password
                </Button>
                {/* <div className="flex gap-2 h-0 overflow-visible items-center ">
                        <span className=" border-t w-full" />
                        <Paragraph className="text-nowrap">
                            Or continue with
                        </Paragraph>
                        <span className=" border-t w-full" />
                    </div>
                    <Button type="button" variant="secondary" className="w-full flex gap-3">
                        <img src="/partners/google.svg" className="size-4" />
                        Google
                    </Button> */}
            </Form>
            <div className="m-1.5 rounded-lg bg-gray-50 py-4 text-center text-sm/5 ring-1 ring-black/5">
                Not your account?
                <Link to="/auth/login" className="font-medium ml-2 hover:text-gray-600">
                    Login here
                </Link>
            </div>
        </div>
    )
}