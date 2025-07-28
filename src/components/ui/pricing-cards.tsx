import { Check, MoveRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function Pricing() {
  return (
    <div className="w-full py-20 lg:py-40 container mx-auto px-10">
      <div className="container mx-auto">
        <div className="flex text-center justify-center items-center gap-4 flex-col">
          <Badge>Pricing</Badge>
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl text-center font-regular">
              Simple pricing for smart schools
            </h2>
            <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl text-center">
              Whether you're a small school or a growing institution, SkoolTech
              offers affordable plans to digitize your operations.
            </p>
          </div>

          <div className="grid pt-20 text-left grid-cols-1 lg:grid-cols-3 w-full gap-8">
            {/* Starter Plan */}
            <Card className="w-full rounded-md">
              <CardHeader>
                <CardTitle>
                  <span className="flex flex-row gap-4 items-center font-normal">
                    Starter
                  </span>
                </CardTitle>
                <CardDescription>
                  For small schools ready to go paperless and simplify classroom
                  management.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-8 justify-start">
                  <p className="flex items-center gap-2 text-xl">
                    <span className="text-4xl">₦20,000</span>
                    <span className="text-sm text-muted-foreground">
                      {" "}
                      / term
                    </span>
                  </p>
                  <div className="flex flex-col gap-4">
                    {[
                      "Student registration & biodata",
                      "Subject & score management",
                      "Basic teacher admin panel",
                    ].map((feature, i) => (
                      <div className="flex gap-4" key={i}>
                        <Check className="w-4 h-4 mt-1 text-primary" />
                        <p>{feature}</p>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="gap-4">
                    Get Started <MoveRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Growth Plan */}
            <Card className="w-full shadow-2xl rounded-md">
              <CardHeader>
                <CardTitle>
                  <span className="flex flex-row gap-4 items-center font-normal">
                    Growth
                  </span>
                </CardTitle>
                <CardDescription>
                  Ideal for growing schools that want enhanced features and full
                  analytics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-8 justify-start">
                  <p className="flex items-center gap-2 text-xl">
                    <span className="text-4xl">₦35,000</span>
                    <span className="text-sm text-muted-foreground">
                      {" "}
                      / term
                    </span>
                  </p>
                  <div className="flex flex-col gap-4">
                    {[
                      "All Starter features",
                      "Detailed student analytics",
                      "Teacher evaluation & dashboards",
                    ].map((feature, i) => (
                      <div className="flex gap-4" key={i}>
                        <Check className="w-4 h-4 mt-1 text-primary" />
                        <p>{feature}</p>
                      </div>
                    ))}
                  </div>
                  <Button variant="default" className="gap-4">
                    Upgrade Plan <MoveRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="w-full rounded-md">
              <CardHeader>
                <CardTitle>
                  <span className="flex flex-row gap-4 items-center font-normal">
                    Enterprise
                  </span>
                </CardTitle>
                <CardDescription>
                  Full suite solution for institutions with multiple branches
                  and admins.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-8 justify-start">
                  <p className="flex items-center gap-2 text-xl">
                    <span className="text-4xl">Custom</span>
                    <span className="text-sm text-muted-foreground">
                      {" "}
                      / term
                    </span>
                  </p>
                  <div className="flex flex-col gap-4">
                    {[
                      "Multi-branch management",
                      "Custom feature integrations",
                      "Dedicated support & training",
                    ].map((feature, i) => (
                      <div className="flex gap-4" key={i}>
                        <Check className="w-4 h-4 mt-1 text-primary" />
                        <p>{feature}</p>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="gap-4">
                    Contact Sales <MoveRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
