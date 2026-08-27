import { Button } from "@rde/ui";

function App() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Button onClick={() => alert("Hello from shared UI")}>
        Shared Button
      </Button>
    </main>
  );
}

export default App;
