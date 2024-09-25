import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function Page() {
  return (
    <div className="h-full flex flex-col gap-6">
      <div className="text-2xl mb-3">Settings</div>
      <form
        action={async () => {
          "use server";

          await signOut();
        }}
      >
        <Button
          className="bg-customAccent hover:bg-customAccent-foreground"
          type="submit"
        >
          Sign out
        </Button>
      </form>
    </div>
  );
}
