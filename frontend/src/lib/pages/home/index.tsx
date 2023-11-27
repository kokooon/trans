import { Button } from '@/lib/components/ui/button';

import CTASection from './components/CTASection';
import SomeText from './components/SomeText';

const Home = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 text-center">
      <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        test
      </Button>
      <SomeText />
      <CTASection />
    </div>
  );
};

export default Home;
