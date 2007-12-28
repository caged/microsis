require 'rubygems'
require 'bluecloth'
require 'cgi'

module Microsis
  class DocBuilder
    class << self
      
      def build_convention_docs
        Dir["docs/conventions/source/*.markdown"].each do |doc|
          source_file = File.read(doc)
          basename = File.basename(doc).gsub!(/\.markdown/, '')
          source_file.gsub! /<macro:jscode[^>]*>(.+?)<\/macro:jscode>/m do |m|
            "<pre><code>#{CGI.escapeHTML($1.strip)}</code></pre>"
          end
          html = layout_file.gsub!(/YIELD/, BlueCloth.new(source_file).to_html)
          File.open(File.join("docs/conventions/", "html", "#{basename}.html"), 'w') do |f|
            f << html
          end
        end
      end
      
      def layout_file
        File.read("docs/conventions/source/layout.html")
      end
    end
  end
end