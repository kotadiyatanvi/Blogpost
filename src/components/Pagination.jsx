import "./Pagination.css";

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPrev, 
  onNext, 
  pageSize, 
  onPageSizeChange 
}) {
  return (
    <div className="pagination-container">
   
      <div className="dropdown">
       
        <select 
          id="page-size"
          value={pageSize} 
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="pagination">
        <button 
          className="page-btn" 
          onClick={onPrev} 
          disabled={currentPage === 1}
        >
          PREV
        </button>
  
        <span className="page-info">{currentPage} of {totalPages}</span>
  
        <button 
          className="page-btn" 
          onClick={onNext} 
          disabled={currentPage === totalPages}
        >
          NEXT
        </button>
      </div>
    </div>
  );
}