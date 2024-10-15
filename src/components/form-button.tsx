import { Button, buttonVariants } from "./ui/button";
import { VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { useFormStatus } from "react-dom";

interface FormButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const FormButton = forwardRef<HTMLButtonElement, FormButtonProps>(
  ({ ...props }, ref) => {
    const { pending } = useFormStatus();

    return <Button ref={ref} disabled={pending} {...props} />;
  }
);
FormButton.displayName = "FormButton";

export default FormButton;
