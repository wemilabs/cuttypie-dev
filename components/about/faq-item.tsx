import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/accordion";

interface FAQItemProps {
  answer: string;
  question: string;
  value: string;
}

const FAQItem = ({ question, answer, value }: FAQItemProps) => (
  <AccordionItem className="border-primary/20" value={value}>
    <AccordionTrigger className="font-display text-base uppercase tracking-wide hover:text-primary hover:no-underline">
      {question}
    </AccordionTrigger>
    <AccordionContent className="text-muted-foreground leading-relaxed">
      {answer}
    </AccordionContent>
  </AccordionItem>
);

export default FAQItem;
