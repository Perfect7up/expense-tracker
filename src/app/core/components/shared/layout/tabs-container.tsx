import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/core/components/ui/tabs";
import { ChevronRight, Info } from "lucide-react";

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
  instructions?: string[];
  title?: string;
}

export function TabsContainer({
  value,
  onValueChange,
  tabs,
  children,
  instructions,
  title,
}: TabsContainerProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-xl overflow-hidden">
      <Tabs value={value} onValueChange={onValueChange} className="w-full">
        <div className="px-6 pt-6">
          {title && (
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              {title}
            </h2>
          )}
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
          
          {instructions && instructions.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50/50 border border-blue-200/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-medium text-blue-800">Quick Tips</p>
              </div>
              <ul className="space-y-1">
                {instructions.map((instruction, index) => (
                  <li key={index} className="text-xs text-blue-700 flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
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