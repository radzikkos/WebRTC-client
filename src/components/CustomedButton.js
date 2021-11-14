import Button from "react-bootstrap/Button";

export const CustomedButton = ({ text, action, color }) => {
  return (
    <div>
      <Button
        variant={color}
        block="true"
        size="lg"
        type="submit"
        className="mt-2"
        onClick={(e) => {
          e.preventDefault();
          action(e);
        }}
      >
        {text}
      </Button>
    </div>
  );
};
