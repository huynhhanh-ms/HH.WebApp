// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faIndustry } from '@fortawesome/free-solid-svg-icons';

const ServiceSection = () => (
    <section className="py-12 text-center bg-white">
      <div className="container mx-auto">
        <h2 className="mb-12 text-3xl font-bold" data-aos="fade-up">Dịch vụ TÂM NGÂN PHÁT</h2>
        <div className="flex flex-col justify-around md:flex-row">
          <div className="mb-12 md:mb-0 md:w-1/2" data-aos="fade-right">
            <div className="flex flex-col items-center">
              {/* <FontAwesomeIcon icon={faIndustry} className="w-8 h-8 mb-4" /> */}
              <h3 className="mb-2 text-xl font-semibold">Dịch vụ sắt thép</h3>
              <p className="text-gray-600">Liên hệ với đội ngũ Dịch vụ Khách hàng của chúng tôi.</p>
            </div>
          </div>
          <div className="mb-12 md:mb-0 md:w-1/2" data-aos="fade-right">
            <div className="flex flex-col items-center">
              {/* <FontAwesomeIcon icon={faIndustry} className="w-8 h-8 mb-4" /> */}
              <h3 className="mb-2 text-xl font-semibold">Dịch vụ sắt thép</h3>
              <p className="text-gray-600">Liên hệ với đội ngũ Dịch vụ Khách hàng của chúng tôi.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

export default ServiceSection;