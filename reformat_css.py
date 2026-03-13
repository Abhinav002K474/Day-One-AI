import re

file_path = r"c:\Users\akabi\OneDrive\Pictures\New folder\Final Year project\styles.css"

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

def fix_css_line(line):
    # 1. Space after colon
    line = re.sub(r':(?=[^\s])', ': ', line)
    
    # 2. Space after comma
    line = re.sub(r',(?=[^\s])', ', ', line)
    
    # 3. Units followed by numbers or new segments
    # "350px1fr" -> "350px 1fr"
    line = re.sub(r'(px|rem|em|vh|vw|%|deg|s)(?=[0-9a-zA-Z])', r'\1 ', line)
    
    # 4. Border/Background keywords
    # "2pxdashed" -> "2px dashed" (handled by unit rule?)
    # "dashedrgba" -> "dashed rgba"
    for kw in ['solid', 'dashed', 'dotted', 'double', 'none', 'rgba', 'rgb', 'var', 'calc', 'linear-gradient']:
        # If merged with preceding text (e.g. "redsolid")
        # Difficult to catch all, but "pxsolid" is common.
        line = re.sub(f'(?<=[a-z0-9])({kw})', r' \1', line)
        
    # 5. Fix calc operators (space required)
    # 100vh-180px -> 100vh - 180px
    if 'calc' in line:
        line = re.sub(r'(?<=[a-z0-9%])\-(?=[a-z0-9])', ' - ', line)
        line = re.sub(r'(?<=[a-z0-9%])\+(?=[a-z0-9])', ' + ', line)

    # 6. Fr unit
    line = re.sub(r'(?<=[0-9])fr', 'fr', line) # ensure attached to number
    # but "1fr" might be "1 fr" if space rule separated it?
    # "350px 1fr" -> "350px 1 fr" -> NO.
    
    # 7. Comments
    line = re.sub(r'/\*([^\s])', r'/* \1', line)
    line = re.sub(r'([^\s])\*/', r'\1 */', line)

    # 8. Clean up double spaces
    line = re.sub(r'\s+', ' ', line)
    
    # 9. Particular fixes for 1fr if split
    line = line.replace('1 fr', '1fr')
    line = line.replace('2 fr', '2fr')
    
    return line.strip()

new_lines = []
for i, line in enumerate(lines):
    if i < 5383:
        new_lines.append(line)
    else:
        content = line.strip()
        if not content:
            new_lines.append('\n')
            continue
            
        fixed = fix_css_line(content)
        
        # Indentation
        if fixed.endswith('{'):
            # Selector - 8 spaces
            new_lines.append(f"        {fixed}\n")
        elif fixed.startswith('}'):
            # Closing - 8 spaces
            new_lines.append(f"        {fixed}\n")
        elif fixed.startswith('/*') and '*/' in fixed and not fixed.endswith('{') and not fixed.endswith(';'):
             # Section comment - 8 spaces
             new_lines.append(f"        {fixed}\n")
        else:
            # Property - 12 spaces
            new_lines.append(f"            {fixed}\n")

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print("Reformatted CSS")
