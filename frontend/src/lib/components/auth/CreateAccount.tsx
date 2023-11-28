"use client"

import { Icons } from "@/lib/components/ui/icone"
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

export function CreateAccount() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Bienvenue</CardTitle>
        <CardDescription>
          Connecte toi ou creé ton compte avec un pseudo unique
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex justify-center">
          <Button variant="outline" className="">
            <Icons.gitHub className="mr-2 h-4 w-4" />
            42 Auth
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              OU CONTINUE AVEC
            </span>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="pseudo">Pseudo</Label>
          <Input id="pseudo"/>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Mots de passe</Label>
          <Input id="password" type="password" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Create account</Button>
      </CardFooter>
      <CardFooter>
        <Button className="w-full">Sign In</Button>
      </CardFooter>
    </Card>
  )
}