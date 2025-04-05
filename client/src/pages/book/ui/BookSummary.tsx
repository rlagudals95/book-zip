import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface BookSummaryProps {
  summary?: string;
  keyPoints?: string[];
}


const BookSummary: React.FC<BookSummaryProps> = ({ summary, keyPoints }) => {
  if (!summary && (!keyPoints || keyPoints.length === 0)) return null;

  return (
    <div className="mb-6 rounded-lg animate-fadeInSlow">
      {/* 타이틀 */}
      <div className="border-b pb-3 mb-4">
        <h2 className="text-xl font-bold text-blue-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          책 요약
        </h2>
      </div>

      {/* 요약 내용 - 마크다운 형식 지원 */}
      {summary && (
        <div className="prose prose-blue prose-headings:text-blue-700 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-blue-700 prose-em:text-indigo-600 prose-ul:list-disc prose-ol:list-decimal max-w-none mb-6 animate-fadeIn">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              h1: (props) => <h1 className="text-2xl font-bold mt-6 mb-4 text-blue-700" {...props} />,
              h2: (props) => <h2 className="text-xl font-bold mt-5 mb-3 text-blue-600" {...props} />,
              h3: (props) => <h3 className="text-lg font-bold mt-4 mb-2 text-blue-600" {...props} />,
              p: (props) => <p className="my-3 text-gray-700" {...props} />,
              ul: (props) => <ul className="my-3 pl-6 list-disc" {...props} />,
              ol: (props) => <ol className="my-3 pl-6 list-decimal" {...props} />,
              li: (props) => <li className="my-1" {...props} />,
              blockquote: (props) => (
                <blockquote className="border-l-4 border-blue-300 pl-4 py-1 my-4 bg-blue-50 rounded italic" {...props} />
              ),
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              code: (props: any) => {
                const { inline, children, ...rest } = props;
                if (inline) {
                  return <code className="bg-blue-50 text-blue-800 px-1 py-0.5 rounded text-sm font-mono" {...rest}>{children}</code>;
                }
                return (
                  <pre className="bg-gray-800 text-gray-100 rounded-md p-4 my-4 overflow-auto">
                    <code className="font-mono text-sm" {...rest}>{children}</code>
                  </pre>
                );
              }
            }}
          >
            {summary}
          </ReactMarkdown>
        </div>
      )}
      
      {/* 핵심 포인트 */}
      {keyPoints && keyPoints.length > 0 && (
        <div className="mt-5 bg-white bg-opacity-60 p-4 rounded-md">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            핵심 포인트
          </h3>
          <ul className="space-y-3">
            {keyPoints.map((point, index) => (
              <li key={index} className="flex items-start animate-fadeIn" style={{ animationDelay: `${index * 150}ms` }}>
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mr-3 flex-shrink-0 mt-0.5 shadow-sm">
                  {index + 1}
                </span>
                <div className="text-gray-700 prose-sm">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: (props) => <p className="my-1" {...props} />,
                      strong: (props) => <strong className="font-bold text-blue-700" {...props} />,
                      em: (props) => <em className="text-indigo-600" {...props} />,
                      a: (props) => <a className="text-blue-600 hover:underline" {...props} />
                    }}
                  >
                    {point}
                  </ReactMarkdown>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BookSummary; 