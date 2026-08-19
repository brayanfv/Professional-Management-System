"use client"

import { MoreHorizontalIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { FormDescription } from "@/components/common/form-description"
import { FormField, FormLabel } from "@/components/common/form-field"
import { FormMessage } from "@/components/common/form-message"

export function DesignSystemShowcase() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl space-y-8 px-6 py-10">
      <header className="space-y-2">
        <Badge variant="neutral">Development only</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">
          Design system primitives
        </h1>
        <p className="text-muted-foreground">
          Internal visual reference for foundational components and states.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Actions and status</CardTitle>
          <CardDescription>Official button and badge variants.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="neutral">Neutral</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Form controls</CardTitle>
            <CardDescription>Default, optional and invalid states.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <FormField>
              <FormLabel htmlFor="showcase-name" required>
                Full name
              </FormLabel>
              <Input id="showcase-name" placeholder="Brayan Favarin" />
              <FormDescription>
                Use the professional&apos;s full legal name.
              </FormDescription>
            </FormField>
            <FormField invalid>
              <FormLabel htmlFor="showcase-email">Email</FormLabel>
              <Input
                id="showcase-email"
                aria-invalid="true"
                aria-describedby="showcase-email-error"
                defaultValue="invalid-email"
              />
              <FormMessage id="showcase-email-error">
                Enter a valid email address.
              </FormMessage>
            </FormField>
            <FormField>
              <FormLabel htmlFor="showcase-notes" optional>
                Notes
              </FormLabel>
              <Textarea id="showcase-notes" placeholder="Additional context" />
            </FormField>
            <FormField>
              <FormLabel htmlFor="showcase-status">Status</FormLabel>
              <Select defaultValue="active">
                <SelectTrigger id="showcase-status">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <div className="flex items-center gap-2">
              <Checkbox id="showcase-checkbox" defaultChecked />
              <Label htmlFor="showcase-checkbox">Receive notifications</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overlays and feedback</CardTitle>
            <CardDescription>
              Keyboard-accessible Base UI interactions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3">
              <Avatar size="sm">
                <AvatarFallback>BF</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>BF</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarFallback>BF</AvatarFallback>
              </Avatar>
            </div>
            <Separator />
            <div className="flex flex-wrap gap-3">
              <Tooltip>
                <TooltipTrigger render={<Button variant="outline" />}>
                  Hover or focus
                </TooltipTrigger>
                <TooltipContent>Helpful contextual information</TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant="outline" size="icon" />}
                >
                  <MoreHorizontalIcon />
                  <span className="sr-only">Open actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Dialog>
                <DialogTrigger render={<Button variant="outline" />}>
                  Open dialog
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm action</DialogTitle>
                    <DialogDescription>
                      Dialogs reserve the footer for explicit actions.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Continue</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Sheet>
                <SheetTrigger render={<Button variant="outline" />}>
                  Open sheet
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Side panel</SheetTitle>
                    <SheetDescription>
                      Prepared for focused forms and mobile controls.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex-1 p-6 text-muted-foreground">
                    Product content will be added in a later stage.
                  </div>
                  <SheetFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Save</Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
