import React, { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { useTheme } from "../contexts/ThemeSelection";
import ThemedButton from "./ThemedButton";

type SubscribeModalProps = {
  show: boolean;
  onClose: () => void;
  onSubscribe: (planId: string) => void;
};

const plans = [
  { id: "sub-basic-1", name: "Basic Plan", price: "£5", duration: "1 month" },
  { id: "sub-pro-6", name: "Pro Plan", price: "£25", duration: "6 months" },
  {
    id: "sub-premium-12",
    name: "Premium Plan",
    price: "£45",
    duration: "12 months",
  },
];

const SubscribeModal: React.FC<SubscribeModalProps> = ({
  show,
  onClose,
  onSubscribe,
}) => {
  const { activeTheme, theme } = useTheme();
  const [selectedPlan, setSelectedPlan] = useState(plans[0].id);

  if (!show) return null;

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header
        closeButton
        style={{ backgroundColor: theme[activeTheme].backgroundColor }}
      >
        <Modal.Title>Upgrade to Premium</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{ backgroundColor: theme[activeTheme].backgroundColor }}
      >
        <p>Select a subscription plan:</p>
        <Form>
          {plans.map((plan) => (
            <Form.Check
              key={plan.id}
              type="radio"
              id={plan.id}
              name="subscriptionPlan"
              label={`${plan.name} — ${plan.price} for ${plan.duration}`}
              value={plan.id}
              checked={selectedPlan === plan.id}
              onChange={(e) => setSelectedPlan(e.target.value)}
            />
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer
        style={{ backgroundColor: theme[activeTheme].backgroundColor }}
      >
        <ThemedButton variant="secondary" onClick={onClose}>
          Cancel
        </ThemedButton>
        <ThemedButton
          variant="primary"
          onClick={() => onSubscribe(selectedPlan)}
        >
          Subscribe
        </ThemedButton>
      </Modal.Footer>
    </Modal>
  );
};

export default SubscribeModal;
