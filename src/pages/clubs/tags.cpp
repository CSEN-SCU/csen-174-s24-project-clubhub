#include <iostream>
#include <fstream>
#include <nlohmann/json.hpp>
#include <vector>
#include <set>
#include <string>
#include <algorithm>
#include <cctype>
#include <sstream>
using namespace std;

using json = nlohmann::json;

std::string slugify(const std::string& input) {
    std::stringstream result;
    bool previousWasHyphen = false;

    for (char c : input) {
        // Convert to lowercase
        if (std::isalpha(c)) {
            result << static_cast<char>(std::tolower(c));
            previousWasHyphen = false;
        } else if (std::isdigit(c)) {
            result << c;
            previousWasHyphen = false;
        } else if (std::isspace(c) || c == '-' || c == '_') {
            if (!previousWasHyphen) {
                result << '-';  // Convert spaces and similar to hyphens
                previousWasHyphen = true;
            }
        }
    }

    // Remove trailing hyphens
    std::string slug = result.str();
    if (slug.back() == '-') {
        slug.pop_back();
    }

    return slug;
}

int main() {
    // Load JSON data from a file
    std::ifstream file("ClubInfo.json"); // Replace with your file's name

    if (!file.is_open()) {
        std::cerr << "Error: Could not open file" << std::endl;
        return 1;
    }

    json jsonData;
    file >> jsonData; // Parse the JSON data

    // Access elements from the JSON array
    
    set<string> tag;

    for (const auto& club : jsonData) {
        if (club.contains("AcademicBackground")) {
            auto academic = club["AcademicBackground"];
            for (const auto& item : academic) {
                tag.insert(item);
            }
        }

        if (club.contains("PracticeArea")) {
            auto practice = club["PracticeArea"];
            for (const auto& item : practice) {
                tag.insert(item);
            }
        }
    }

    std::cout << "\nAll Tags:" << std::endl;
    for (const auto& item : tag) {
        std::cout << slugify(item) << std::endl;
    }

    return 0;
}
