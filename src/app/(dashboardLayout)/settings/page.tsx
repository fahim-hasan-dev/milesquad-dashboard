import BrandTable from "@/components/page/settings/BrandTable";
import CategoryTable from "@/components/page/settings/CategoryTable";
import ColorTable from "@/components/page/settings/ColorTable";
import SettingTabs from "@/components/page/settings/SettingTabs";
import SizeTable from "@/components/page/settings/SizeTable";
import TermsAndPolicy from "@/components/page/settings/TermsAndPolicy";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { demoBrandsData } from "@/demoData/brands";
import { demoCategoriesData } from "@/demoData/categories";
import { demoColorsData } from "@/demoData/colors";
import { demoSizesData } from "@/demoData/sizes";

import SettingsPageContent from "../pricing/page";

export default function SettingPage() {
  return <SettingsPageContent />;
}
