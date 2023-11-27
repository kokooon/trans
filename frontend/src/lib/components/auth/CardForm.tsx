// import * as React from "react"

import { Button } from "@/lib/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/lib/components/ui/select"

export function CardForm() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Bienvenue</CardTitle>
        <CardDescription>Connectez vous avec votre UserName et votre Password</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Pseudo</Label>
              <Input id="name" placeholder="Ton Pseudo" className="bg-white-200"/>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Mots De Passe</Label>
              <Input id="password" placeholder="Ton Mots De Passe" className="bg-white-200" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button className="bg-sky-500 text-black">SignUp</Button>
        <Button className="bg-green-500 text-black">Login</Button>
      </CardFooter>
    </Card>
  );
}
