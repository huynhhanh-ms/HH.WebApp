const CompanyInfo = () => (
    <div className="bg-gray-100 p-10">
      <div className="bg-black text-white p-3 inline-block">
        VỀ CHÚNG TÔI
      </div>
      <div className="grid grid-cols-2 gap-10 mt-5">
        <div>
          <h2 className="font-bold">DẪN ĐẦU VỀ</h2>
          <ul className="list-disc pl-5">
            <li>Thép xây dựng</li>
            <li>Ống thép</li>
          </ul>
        </div>
        <div>
          <h2 className="font-bold">DOANH THU: hơn 100 tỷ đồng (năm 2023)</h2>
        </div>
        <div>
          <h2 className="font-bold">SỐ CÁN BỘ CÔNG NHÂN VIÊN: hơn 100 người (năm 2023)</h2>
        </div>
        <div>
          <h2 className="font-bold">HỆ THỐNG NHÀ MÁY</h2>
          <ul className="list-disc pl-5">
            <li>TP. Hồ Chí Minh</li>
            <li>Hà Nội</li>
            <li>Bình Dương</li>
            <li>Đồng Nai</li>
            <li>Bà Rịa Vũng Tàu</li>
          </ul>
        </div>
      </div>
    </div>
  );

export default CompanyInfo;
