// import CheckoutForm from "@/components/checkout/CheckoutForm";
// import Container from "@/components/layout/Container";
// import Logo from "@/components/Logo";

// const CheckoutPage = () => {
//   return (
//     <div className="w-full flex flex-col min-h-screen bg-gray-100">
//       <header className="py-5 sticky top-0 z-50 bg-white backdrop-blur-md shadow">
//         <div className="max-w-7xl mx-auto px-4">
//           <Logo />
//         </div>
//       </header>

//       <Container className="w-full py-10 flex-1">
//         <CheckoutForm />
//       </Container>

//       <footer>
//         <Container>footer</Container>
//       </footer>
//     </div>
//   );
// };

// export default CheckoutPage;



import CheckoutForm from "@/components/checkout-page/CheckoutForm";
import Container from "@/components/layout/Container";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Container>
        <div className="container mx-auto px-4 py-10 md:py-16">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-darkColor">
              Checkout
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Complete your information to place your order.
            </p>
          </div>

          <CheckoutForm />
        </div>
      </Container>
    </main>
  );
}
