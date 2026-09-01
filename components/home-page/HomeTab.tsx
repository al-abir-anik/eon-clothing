import { productType } from "@/constants/data";
import Link from "next/link";

interface Props {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const HomeTab = ({ selectedTab, setSelectedTab }: Props) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-5  text-sm font-semibold">
      <div className="flex items-center gap-3">
        {productType?.map((item) => (
          <button
            onClick={() => setSelectedTab(item?.title)}
            key={item?.title}
            className={`px-4 py-1.5 md:px-6 md:py-2.5 rounded-full text-darkColor hover:text-white border border-darkColor/30  hover:bg-darkColor transition-colors  ${selectedTab === item?.title ? "bg-darkColor text-white" : "bg-transparent"}`}
          >
            {item?.title}
          </button>
        ))}
      </div>
      {/* <Link
        href={"/shop"}
        className="px-4 py-1.5 md:px-6 md:py-2.5 rounded-full text-darkColor hover:text-white border border-darkColor/30 bg-transparent hover:bg-darkColor tracking-wide transition-colors"
      >
        See all
      </Link> */}
    </div>
  );
};

export default HomeTab;
