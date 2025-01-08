interface DividerProps {
  size: string;
}

const Divider = ({ size }: DividerProps) => {
  return <hr className={`w-${size} border-t border-gray-300 my-10`} />;
};

export default Divider;
