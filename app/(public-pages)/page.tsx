import HomeBanner from "@/components/home-page/HomeBanner";
import WhyEon from "@/components/home-page/WhyEon";
import FeaturedProducts from "@/components/home-page/FeaturedProducts";
import BottomBanner from "@/components/home-page/BottomBanner";
import ShopByColor from "@/components/home-page/ShopByColor";
import CustomerReviews from "@/components/home-page/CustomerReviews";
import InstagramSection from "@/components/home-page/InstagramSection";

const HomePage = () => {
  return (
    <div className="">
      <HomeBanner />
      {/* <FeaturedProducts /> */}
      <WhyEon />
      <BottomBanner />
      <ShopByColor />
      <CustomerReviews />
      <InstagramSection />
    </div>
  );
};

export default HomePage;
