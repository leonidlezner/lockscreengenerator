import About from "./components/About";
import Editor from "./components/Editor";

export default function App() {
  return (
    <div className="container mx-auto sm:mt-3">
      <div className="text-center">
        <h1 className="bg-gray-800 px-5 py-2 text-2xl text-gray-500 sm:mb-3 sm:inline-block sm:rounded-md">
          Lock Screen Generator
        </h1>
      </div>
      <Editor />
      <About />
    </div>
  );
}
