import React, { PureComponent } from "react";

export interface PaginationProps {
  currPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export interface PaginationState {}

class Pagination extends React.PureComponent<PaginationProps, PaginationState> {
  // state = { :  }

  generatePages = () => {
    const { currPage, totalPages } = this.props;
    let pages = [];

    if (currPage === 1 || currPage === 2) {
      pages.push({
        num: 1,
        active: 1 === currPage,
      });
      if (2 <= totalPages) {
        pages.push({
          num: 2,
          active: 2 === currPage,
        });
      }
      if (3 <= totalPages) {
        pages.push({
          num: 3,
          active: false,
        });
      }
    } else if (currPage === totalPages - 1 || currPage === totalPages) {
      pages.push({
        num: totalPages,
        active: currPage === totalPages,
      });
      pages.push({
        num: totalPages - 1,
        active: currPage === totalPages - 1,
      });
      pages.push({
        num: totalPages - 2,
        active: false,
      });
    } else {
      for (let i = 0; i < 3; i++) {
        pages.push({
          num: currPage - 1 + i,
          active: currPage === currPage - 1 + i,
        });
      }
    }
    pages.sort((a, b) => a.num - b.num);
    return pages;
  };

  renderPageNumbers = () => {
    const { onPageChange } = this.props;
    let pages = this.generatePages();

    let res: JSX.Element[] = [];
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].active) {
        res.push(
          <li className="page-item active" aria-current="page">
            <span className="page-link">{pages[i].num}</span>
          </li>
        );
      } else {
        res.push(
          <li className="page-item">
            <a className="page-link" onClick={() => onPageChange(pages[i].num)}>
              {pages[i].num}
            </a>
          </li>
        );
      }
    }
    return res;
  };

  renderPrevButton = () => {
    const { currPage, onPageChange } = this.props;
    if (currPage <= 1) {
      return (
        <li className="page-item disabled">
          <span className="page-link" aria-disabled="true">
            Previous
          </span>
        </li>
      );
    } else {
      return (
        <li className="page-item">
          <a className="page-link" onClick={() => onPageChange(currPage - 1)}>
            Previous
          </a>
        </li>
      );
    }
  };

  renderNextButton = () => {
    const { currPage, onPageChange, totalPages } = this.props;
    if (currPage >= totalPages) {
      return (
        <li className="page-item disabled">
          <span className="page-link" aria-disabled="true">
            Next
          </span>
        </li>
      );
    } else {
      return (
        <li className="page-item">
          <a className="page-link" onClick={() => onPageChange(currPage + 1)}>
            Next
          </a>
        </li>
      );
    }
  };

  renderJumpButton = () => {
    const lambda = () => {
      let page = prompt(
        "Jump to page: (" + 1 + "-" + this.props.totalPages + ")"
      );
      if (page != null) {
        let pageNum = parseInt(page!);
        this.props.onPageChange(
          Math.min(this.props.totalPages, Math.max(1, pageNum))
        );
      }
    };
    return (
      <li className="page-item">
        <a className="page-link" onClick={lambda}>
          Jump to page...
        </a>
      </li>
    );
  };

  render() {
    return (
      <nav aria-label="pagenav">
        <ul className="pagination">
          {this.renderPrevButton()}
          {this.renderPageNumbers()}
          {this.renderNextButton()}
          {this.renderJumpButton()}
        </ul>
      </nav>
    );
  }
}

export default Pagination;
