//import React from 'react';
import { Button } from "@/lib/components/ui/button";

export function CreateAccount() {
  return (
    <div className="flex justify-center">
      <Button variant="outline" onClick={() => window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-583457b7e26f8aded8eb59025a81e8399ae8f76265cc6e3b0ba7cc99fe3560cc&redirect_uri=http%3A%2F%2F127.0.0.1%3A3001%2Fauth%2F42%2Fcallback&response_type=code'}>
        <img src='../../../../assets/Final-sigle-seul.svg' className="mr-2 w-10 h-10" />
      </Button>
    </div>
  );
}

