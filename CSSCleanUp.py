import cssutils
import re

def clean_css(css_content):
    parser = cssutils.CSSParser()
    stylesheet = parser.parseString(css_content)

    combined_rules = {}

    for rule in stylesheet:
        if rule.type == rule.STYLE_RULE:
            selector = rule.selectorText
            if selector not in combined_rules:
                combined_rules[selector] = {}
            for property in rule.style:
                combined_rules[selector][property.name] = property.value

    cleaned_css = ""
    for selector, properties in combined_rules.items():
        cleaned_css += f"{selector} {{\n"
        for prop_name, prop_value in properties.items():
            cleaned_css += f"  {prop_name}: {prop_value};\n"
        cleaned_css += "}\n"
    
    return cleaned_css

def read_css_file(file_path):
    with open(file_path, 'r') as file:
        return file.read()

def write_css_file(file_path, content):
    with open(file_path, 'w') as file:
        file.write(content)

def main(input_file, output_file):
    css_content = read_css_file(input_file)

    cleaned_css = clean_css(css_content)

    write_css_file(output_file, cleaned_css)
    print(f"Cleaned CSS has been written to {output_file}")

if __name__ == "__main__":
    input_file = 'input.css'
    output_file = 'JTTH_CHAR_SHEET.css'
    main(input_file, output_file)
