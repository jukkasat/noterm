import { createHead, UnheadProvider } from '@unhead/react/client';
import { InferSeoMetaPlugin } from '@unhead/addons';
import { Toaster } from "@/components/ui/toaster";
import AppRouter from './AppRouter';

const head = createHead({
  plugins: [
    InferSeoMetaPlugin(),
  ],
});

export function App() {
  return (
    <UnheadProvider head={head}>
      <Toaster />
      <AppRouter />
    </UnheadProvider>
  );
}

export default App;
