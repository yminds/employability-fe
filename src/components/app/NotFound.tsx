import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NotFound404 from "@/assets/error/404NotFound.svg";

export default function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-white">
      <div className="max-w-lg text-center">
        <img
          src={NotFound404 || "/placeholder.svg"}
          alt="404 Not Found"
          className="mx-auto mb-8 w-[400px] h-auto"
        />

        <h1 className="text-xl font-medium text-[#202326] mb-2">
          Whoops! This is not what you were looking for
        </h1>

        <p className="text-[#68696b] mb-8">
          But you just found the page we had lost, thanks. Try your luck by
          going back!
        </p>

        <Button
          onClick={handleGoHome}
          className="px-6 py-2 text-[#001630] bg-white border border-[#001630] hover:bg-[#e1f2ea]"
        >
          Take me Home
        </Button>
      </div>
    </div>
  );
}
