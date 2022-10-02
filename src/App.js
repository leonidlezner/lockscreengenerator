import About from "./components/About";
import Editor from "./components/Editor";
import QRCode from "./components/QRCode";

export default function App() {
  return (
    <div className="container mx-auto sm:mt-3">
      <div className="flex items-center justify-center sm:mb-3">
        <h1 className="rounded-md bg-gray-800 px-5 py-2 text-2xl text-gray-500">
          Lock Screen Generator
        </h1>
        <QRCode
          text={process.env.PUBLIC_URL}
          size={60}
          darkColor="#fff"
          lightColor="#111827"
        />
      </div>
      <Editor />
      <About />
    </div>
  );
}
