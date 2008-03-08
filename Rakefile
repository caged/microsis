# test
require 'rake'
require 'rake/packagetask'
require 'fileutils'
require 'pathname'
include FileUtils

$:.unshift(File.expand_path(File.dirname(__FILE__)))
%w(lib vendor).each do |d|
  $:.unshift(File.join(File.dirname(__FILE__)), d)
end

require 'doc_builder'

YUI_COMPRESSOR_BIN = "java -jar vendor/yuicompressor/build/yuicompressor-2.2.4.jar --warn"
JAVASCRIPT_SOURCE_FILES = Dir["src/**/*.js"]

desc "Create builds from source"
task :build do
  JAVASCRIPT_SOURCE_FILES.each do |f|
    path = Pathname.new(f)
    component = path.parent.basename
    mkdir("build/#{component}") unless (File.exists?("build/#{component}"))
    cp path, File.join('build', component)
  end
end

desc "Compress build files using YUI Compressor"
task :compress => :build do
  js_files = Dir["build/**/*.js"].select {|f| !File.basename(f).include?('min')}
  js_files.sort_by {|x| File.basename(x) }.each do |f|
    puts "COMPRESSING: #{File.basename(f)}"
    path = Pathname.new(f)
    basename = path.basename(f).sub(/\.js$/, '')
    compressed_name = path.parent + "#{basename}-min.js"
    `#{YUI_COMPRESSOR_BIN} -o #{compressed_name} #{path}`
  end
end

namespace :doc do
  desc "Create API documentation for all Microsis JavaScript source files"
  task :api => :build do 
    dir = File.expand_path(File.dirname(__FILE__))
    rm Dir["docs/api/*"] 
    vendor_dir = File.join(dir, 'vendor')
    jsdoc_dir = File.expand_path(File.join(vendor_dir, 'jsdoc'))
    microsis_template = "#{File.join(dir, 'lib', 'templates', 'microsis')}"
    jsdoc_template = File.join('templates', 'jsdoc')
    cd jsdoc_dir
    command = "java -jar  jsrun.jar app/run.js -t=#{jsdoc_template} -r=3 -d=#{File.join(dir, 'docs', 'api')} ../../src"
    puts "RUNNING: #{command}"
    puts `#{command}`
  end

  desc "Generate Convention documents from source files"
  task :convention do
    # making a change
    Microsis::DocBuilder.build_convention_docs
  end
end
