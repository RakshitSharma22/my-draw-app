import { Button } from "@/UI/Button";

import { Input } from "@/UI/Input";

export default function Home() {
  return (
    <div className="p-6 space-y-4 max-w-md mx-auto">
      <Input placeholder="Your Name" />
      <Input placeholder="Your Email" type="email" />
      <Input placeholder="Message" />
  </div>
  );
}
