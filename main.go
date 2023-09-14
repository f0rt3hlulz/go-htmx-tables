package main

import (
    "html/template"
    "log"
    "net/http"
)

func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        tmpl, err := template.ParseFiles("templates/index.html")
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        tmpl.Execute(w, nil)
    })


    http.HandleFunc("/get-table", func(w http.ResponseWriter, r *http.Request) {
		// Получаем значение выбранной таблицы из параметра запроса "value"
		tableType := r.FormValue("value")
	
		// Определите путь к файлу шаблона для каждой из таблиц
		var templatePath string
	
		switch tableType {
		case "table1":
			templatePath = "templates/table1.html"
		case "table2":
			templatePath = "templates/table2.html"
		case "table3":
			templatePath = "templates/table3.html"
		case "table4":
			templatePath = "templates/table4.html"
		case "table5":
			templatePath = "templates/table5.html"
		// Добавьте другие варианты таблиц по аналогии
		default:
			templatePath = "" // По умолчанию нет шаблона
		}
	
		// Если есть путь к шаблону, загрузите его и отправьте как ответ
		if templatePath != "" {
			tmpl, err := template.ParseFiles(templatePath)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
	
			tmpl.Execute(w, nil)
		} else {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("Таблица не найдена"))
			// Добавьте вывод ошибки для отладки
			log.Printf("Таблица не найдена: %s", tableType)
		}
	})	

    http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

    http.ListenAndServe(":8080", nil)
}
