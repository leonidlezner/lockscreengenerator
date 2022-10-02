import About from "./components/About";
import Editor from "./components/Editor";

export default function App() {
  return (
    <div className="container mx-auto sm:mt-3">
      <Editor />
      <About />
    </div>
  );
}
