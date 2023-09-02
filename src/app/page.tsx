import Navbar from "@/components/Navbar";
import RecipeForm from "@/components/RecipeForm";
import Image from "next/image";

export default function Home() {
  return (
      <main>
        <Navbar />
        <RecipeForm/>
      </main>
  );
}
