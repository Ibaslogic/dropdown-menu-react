import { useEffect, useRef, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';

interface MultiLevelDropdownMenuProps {
  buttonLabel: string;
  items: {
    title: string;
    url?: string;
    icon?: JSX.Element;
    action?: () => void;
    submenu?: {
      title: string;
      icon?: JSX.Element;
      action?: () => void;
    }[];
  }[];
}

export const MultiLevelDropdownMenu = ({
  buttonLabel,
  items,
}: MultiLevelDropdownMenuProps) => {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(
    null
  );
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState<
    number | null
  >(null);
  const [focusedSubmenuIndex, setFocusedSubmenuIndex] = useState<
    number | null
  >(null);

  const navigate = useNavigate();

  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prev) => {
      if (!prev) {
        setFocusedIndex(null);
        setOpenSubmenuIndex(null);
        setFocusedSubmenuIndex(null);
      }
      return !prev;
    });
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setFocusedIndex(0); // Focus on the first item when arrow is pressed
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    } else if (event.key === 'Escape') {
      setOpen(false);
      setFocusedIndex(null); // Reset focus when dropdown closes
    }
  };

  const handleItemKeyDown = (
    event: React.KeyboardEvent<HTMLLIElement>,
    index: number
  ) => {
    const currentItem = items[index];

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setFocusedIndex((prevIndex) =>
        prevIndex! < items.length - 1 ? prevIndex! + 1 : 0
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setFocusedIndex((prevIndex) =>
        prevIndex! > 0 ? prevIndex! - 1 : items.length - 1
      );
    } else if (event.key === 'ArrowRight' && currentItem.submenu) {
      event.preventDefault();
      setOpenSubmenuIndex(index);
      setFocusedSubmenuIndex(0);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (currentItem.submenu) {
        setOpenSubmenuIndex((prev) =>
          prev === index ? null : index
        );
      } else if (currentItem.url) {
        navigate(currentItem.url);
        setOpen(false);
        buttonRef.current?.focus();
      } else if (currentItem.action) {
        currentItem.action();
        setOpen(false);
      }
    } else if (event.key === 'Escape') {
      setOpen(false);
      setFocusedIndex(null);
      setOpenSubmenuIndex(null);
      buttonRef.current?.focus();
    }
  };

  useEffect(() => {
    const handler = (event: MouseEvent | TouchEvent) => {
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [open]);

  useEffect(() => {
    if (open && focusedIndex !== -1) {
      const focusedItem = document.getElementById(
        `dropdown-item-${focusedIndex}`
      );
      focusedItem?.focus();
    }
  }, [focusedIndex, open]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenuIndex((prevIndex) =>
      prevIndex === index ? null : index
    );
  };

  const handleSubmenuKeyDown = (
    event: React.KeyboardEvent<HTMLLIElement>,
    submenu: { title: string; action?: () => void }[],
    index: number
  ) => {
    console.log(index);
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setFocusedSubmenuIndex((prevIndex) =>
        prevIndex! < submenu.length - 1 ? prevIndex! + 1 : 0
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setFocusedSubmenuIndex((prevIndex) =>
        prevIndex! > 0 ? prevIndex! - 1 : submenu.length - 1
      );
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setFocusedSubmenuIndex(null);
      setOpenSubmenuIndex(null);
      setFocusedIndex(openSubmenuIndex);
      const triggerElement = document.getElementById(
        `dropdown-item-${openSubmenuIndex}`
      );
      triggerElement?.focus(); // Set focus to the submenu trigger
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const selectedSubItem = submenu[focusedSubmenuIndex!];
      selectedSubItem.action?.();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setFocusedSubmenuIndex(null);
      setFocusedIndex(openSubmenuIndex);
      setOpenSubmenuIndex(null);
    }
  };

  useEffect(() => {
    if (openSubmenuIndex !== null && focusedSubmenuIndex !== null) {
      document
        .getElementById(`submenu-item-${focusedSubmenuIndex}`)
        ?.focus();
    }
  }, [focusedSubmenuIndex, openSubmenuIndex]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={buttonRef}
        id="dropdown-button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="dropdown-menu"
        type="button"
        className="inline-flex items-center justify-center rounded-md text-sm border border-[#e4e4e7] h-10 px-4 py-2"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
      >
        {buttonLabel}
        <span className="ml-2">
          {open ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </button>
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-12">
          <ul
            role="menu"
            id="dropdown-menu"
            aria-labelledby="dropdown-button"
            className="w-56 h-auto shadow-md rounded-md p-1 border bg-white"
          >
            {items.map((item, index) => (
              <li
                role="menuitem"
                key={index}
                id={`dropdown-item-${index}`}
                className={`relative flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 rounded-md ${
                  focusedIndex === index && openSubmenuIndex === null
                    ? 'bg-gray-100'
                    : ''
                }`}
                onMouseEnter={() => handleSubmenuToggle(index)}
                onMouseLeave={() => handleSubmenuToggle(index)}
                tabIndex={focusedIndex === index ? 0 : -1}
                onKeyDown={(event) => handleItemKeyDown(event, index)}
              >
                {item.icon && <span>{item.icon}</span>}
                {item.url ? (
                  <Link
                    to={item.url}
                    className="w-full text-left"
                    onClick={() => setOpen(false)}
                  >
                    {item.title}
                  </Link>
                ) : (
                  <>
                    <button
                      className="w-full text-left flex justify-between items-center"
                      onClick={() => {
                        if (item.submenu) {
                          handleSubmenuToggle(index);
                        } else if (item.action) {
                          item.action();
                          setOpen(false);
                        }
                      }}
                    >
                      {item.title}
                      {item.submenu && <IoIosArrowForward />}
                    </button>
                    {item.submenu && openSubmenuIndex === index && (
                      <ul className="absolute left-full top-0 mt-0.5 shadow-md rounded-md p-1 bg-white border">
                        {item.submenu.map((subitem, subindex) => (
                          <li
                            key={subindex}
                            id={`submenu-item-${subindex}`}
                            onKeyDown={(event) =>
                              handleSubmenuKeyDown(
                                event,
                                item.submenu!,
                                subindex
                              )
                            }
                            className={`flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 rounded-md ${
                              focusedSubmenuIndex === subindex
                                ? 'bg-gray-100'
                                : ''
                            }`}
                            tabIndex={
                              focusedSubmenuIndex === subindex
                                ? 0
                                : -1
                            }
                          >
                            {subitem.icon && (
                              <span>{subitem.icon}</span>
                            )}
                            <button
                              onClick={() => {
                                subitem.action?.();
                                setOpen(false);
                              }}
                            >
                              {subitem.title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
