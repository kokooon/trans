// import { Button } from '@/lib/components/ui/button';
import { CreateAccount } from "@/lib/components/auth/CreateAccount";

// import CTASection from './components/CTASection';
// import SomeText from './components/SomeText';

const Home = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 text-center">
      <CreateAccount/>
    </div>
  );
};

export default Home;
