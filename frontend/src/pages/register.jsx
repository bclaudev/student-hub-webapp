import { RegisterForm } from "@/components/register-form";
import ThemeToggle from "@/components/ui/theme-toggle";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full">
        <RegisterForm />
      </div>
    </div>
  );
}
