import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel } from "~/components/v3/core/form";
import { Link } from "react-router";
import { Mark } from "~/components/v3/logo";
import { InputControl } from "~/components/v3/core/form/control";
import { Button } from "~/components/v3/core/button";

export default () => {
    const form = useForm()

    return (
        <div className="isolate flex min-h-dvh items-center justify-center p-6 lg:p-8">
            <div className="w-full max-w-md rounded-xl bg-white shadow-md ring-1 ring-black/5">
                <Form control={form} method="post" action="./" className="p-7 sm:p-11 space-y-8">
                    <div>
                        <div className="flex items-start">
                            <Link to="/" title="Home">
                                <Mark className="h-9 fill-black" />
                            </Link>
                        </div>
                        <h1 className="mt-8 text-base/6 font-medium">Reset your passord!</h1>
                        <p className="mt-1 text-sm/5 text-gray-600">
                            Reset your password to access to your account.
                        </p>
                    </div>

                    <FormField
                        name="passord"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel>Password</FormLabel>
                                <InputControl required type="password" {...field} />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="confirm_passord"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel>Confirm Password</FormLabel>
                                <InputControl required type="password" {...field} />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full">
                        Reset Password
                    </Button>
                </Form>
                <div className="m-1.5 rounded-lg bg-gray-50 py-4 text-center text-sm/5 ring-1 ring-black/5">
                    Not your account?
                    <Link to="/auth/login" className="font-medium ml-2 hover:text-gray-600">
                        Login here
                    </Link>
                </div>
            </div>
        </div>
    )
}