import cls from 'classnames';
import { ChromePicker } from 'react-color';
import { AiOutlineDoubleLeft, AiOutlineDoubleRight, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import Select from './Select';

const getOption = (v) => ({ value: v, label: v });
const options = [getOption(1), getOption(2), getOption(3), getOption(4)];

const PaginationItem = ({
   children,
   className = '',
   disabled,
   first = false,
   last = false,
   active = false,
   ...props
}) => (
   <li
      {...props}
      className={cls(
         'tw-transition-all tw-cursor-pointer tw-flex tw-items-center tw-text-[#7E7E7E] tw-px-[12px] tw-py-[6px] tw-bg-white tw-border tw-border-solid',
         className,
         { 'tw-border-[#44bdec] tw-bg-[#44bdec] tw-text-white': active },
         { 'tw-cursor-not-allowed': disabled },
         { 'hover:tw-border-[#44bdec] hover:tw-bg-[#44bdec] hover:tw-text-white': !disabled },
         { 'tw-rounded-l-md': first },
         { 'tw-rounded-r-md': last }
      )}
   >
      {children}
   </li>
);

const FirstPage = (props) => (
   <PaginationItem first {...props}>
      <AiOutlineDoubleLeft />
   </PaginationItem>
);

const PrevPage = (props) => (
   <PaginationItem {...props}>
      <AiOutlineLeft />
   </PaginationItem>
);

const EllipsisPage = (props) => (
   <PaginationItem disabled {...props}>
      ...
   </PaginationItem>
);

const NextPage = (props) => (
   <PaginationItem {...props}>
      <AiOutlineRight />
   </PaginationItem>
);

const LastPage = (props) => (
   <PaginationItem last {...props}>
      <AiOutlineDoubleRight />
   </PaginationItem>
);

const Page = ({ children, ...props }) => <PaginationItem {...props}>{children}</PaginationItem>;

const Pagination = ({ page, onPageChange, onLimitChange, totalPages, hasNextPage, hasPrevPage, totalDocs }) => {
   const renderPagination = () => {
      const pages = [];

      pages.push(<FirstPage disabled={page === 1} onClick={() => onPageChange('first')} />);
      pages.push(<PrevPage disabled={page === 1} onClick={() => onPageChange('prev')} />);

      for (let currPage = 0; currPage < totalPages; currPage++) {
         pages.push(<Page>{currPage + 1}</Page>);
      }

      pages.push(<NextPage disabled={!hasNextPage} onClick={() => onPageChange('next')} />);
      pages.push(<LastPage disabled={page >= totalPages} />);

      return pages;
   };

   return (
      <div className="tw-flex tw-flex-col tw-items-center tw-gap-3 tw-overflow-visible">
         <p className="tw-m-0">{`Showing ${5} of ${totalDocs}`}</p>
         <ul className="tw-flex ">{renderPagination()}</ul>
         <Select className="tw-mb-6" options={options} placeholder="Select Page Size" defaultValue={getOption(1)} />
      </div>
   );
};

export default Pagination;
