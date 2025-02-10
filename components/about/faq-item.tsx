const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => (
  <div className="mb-8">
    <h3 className="text-xl font-bold mb-3">{question}</h3>
    <p className="text-white/70 leading-relaxed">{answer}</p>
  </div>
);

export default FAQItem;
