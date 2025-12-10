import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/core/components/ui/tabs";
import { ChevronRight } from "lucide-react";

interface Tab {
  value: string;
  icon: React.ReactNode;
  label: string;
}

interface TabsContainerProps {
  value: string;
  onValueChange: (value: string) => void;
  tabs: Tab[];
  children: React.ReactNode;
}

export function TabsContainer({
  value,
  onValueChange,
  tabs,
  children,
}: TabsContainerProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm border rounded-2xl shadow-xl overflow-hidden">
      <Tabs value={value} onValueChange={onValueChange} className="w-full">
        <div className="px-6 pt-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-4 bg-transparent">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg py-3 transition-all duration-300"
              >
                {tab.icon}
                <span>{tab.label}</span>
                <ChevronRight className="h-4 w-4 ml-auto opacity-50" />
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {children}
      </Tabs>
    </div>
  );
}

interface TabContentProps {
  value: string;
  children: React.ReactNode;
}

export function TabContent({ value, children }: TabContentProps) {
  return (
    <TabsContent value={value} className="mt-6 px-6 pb-6">
      {children}
    </TabsContent>
  );
}
